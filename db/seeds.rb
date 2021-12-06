# Cleaning all DB model
puts "Cleaning database..."
Tag.destroy_all
puts "=============================="

# Create tags
puts "Creating some tags..."

tag1 = Tag.new(name: "FPS")
tag1.save

tag2 = Tag.new(name: "ACTION")
tag2.save

tag3 = Tag.new(name: "MMO")
tag3.save

tag4 = Tag.new(name: "GORE")
tag4.save

tag5 = Tag.new(name: "BLOOD")
tag5.save

# Check
puts "Some tags creating ..."
